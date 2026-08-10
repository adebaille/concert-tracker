import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import "../styles/parametres.css";

// L'URL publique finit par .../avatars/123456.jpg → on extrait "123456.jpg"
function fileNameFromPublicUrl(url: string): string | null {
  const parts = url.split("/avatars/");
  return parts.length === 2 ? parts[1] : null;
}

function ParametresPage() {
  const [displayName, setDisplayName] = useState("");
  const [avatarStyle, setAvatarStyle] = useState<"kpop" | "metal">("kpop");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [nameMessage, setNameMessage] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isSavingEmail, setIsSavingEmail] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadProfil() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      setEmail(userData.user.email ?? "");

      const { data } = await supabase
        .from("profils")
        .select("display_name, avatar_style, avatar_url")
        .eq("id", userData.user.id)
        .single();

      if (data) {
        setDisplayName(data.display_name);
        setAvatarStyle(data.avatar_style);
        setAvatarUrl(data.avatar_url ?? "");
      }
    }
    loadProfil();
  }, []);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setNameMessage("");

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setNameMessage("Erreur : utilisateur introuvable.");
      setIsUploadingAvatar(false);
      return;
    }

    // Remplacement propre : supprimer l'ancien avatar d'abord
    if (avatarUrl) {
      const oldName = fileNameFromPublicUrl(avatarUrl);
      if (oldName) {
        await supabase.storage.from("avatars").remove([oldName]);
      }
    }

    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (uploadError) {
      setNameMessage("Upload impossible : " + uploadError.message);
      setIsUploadingAvatar(false);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    // On enregistre tout de suite l'URL dans le profil
    const { error: updateError } = await supabase
      .from("profils")
      .update({ avatar_url: publicData.publicUrl })
      .eq("id", userData.user.id);

    if (updateError) {
      setNameMessage("Erreur : " + updateError.message);
      setIsUploadingAvatar(false);
      return;
    }

    setAvatarUrl(publicData.publicUrl);
    setIsUploadingAvatar(false);
  }

  async function handleRemoveAvatar() {
    if (!avatarUrl) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const oldName = fileNameFromPublicUrl(avatarUrl);
    if (oldName) {
      await supabase.storage.from("avatars").remove([oldName]);
    }

    await supabase
      .from("profils")
      .update({ avatar_url: null })
      .eq("id", userData.user.id);

    setAvatarUrl("");
  }

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNameMessage("");
    setIsSavingName(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setNameMessage("Erreur : utilisateur introuvable.");
      setIsSavingName(false);
      return;
    }

    const { error } = await supabase
      .from("profils")
      .update({ display_name: displayName })
      .eq("id", userData.user.id);

    if (error) {
      setNameMessage("Erreur : " + error.message);
    } else {
      setNameMessage("Prénom mis à jour !");
    }
    setIsSavingName(false);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailMessage("");
    setIsSavingEmail(true);

    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      setEmailMessage("Erreur : " + error.message);
    } else {
      setEmailMessage(
        "Un email de confirmation a été envoyé à la nouvelle adresse. Le changement sera effectif une fois le lien cliqué."
      );
    }
    setIsSavingEmail(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage("Erreur : " + error.message);
    } else {
      setMessage("Mot de passe mis à jour !");
      setNewPassword("");
    }
    setIsLoading(false);
  }

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Paramètres</h1>
      </div>

      <div className="pa-wrap">
        <section className="pa-section">
          <div className="pa-section-title">Profil</div>
          <form onSubmit={handleNameSubmit}>
            <div className="pa-profile-row">
              <div className="pa-avatar-block">
                <div className={`pa-avatar ${avatarStyle}`}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" />
                  ) : (
                    displayName[0] ?? "?"
                  )}
                </div>
                <div className="pa-avatar-buttons">
                  <label className="btn-ghost pa-avatar-btn">
                    {isUploadingAvatar ? "Envoi..." : avatarUrl ? "Changer" : "Ajouter"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={isUploadingAvatar}
                      hidden
                    />
                  </label>
                  {avatarUrl && (
                    <button
                      type="button"
                      className="btn-ghost pa-avatar-remove"
                      onClick={handleRemoveAvatar}
                      disabled={isUploadingAvatar}>
                      Retirer
                    </button>
                  )}
                </div>
              </div>
              <div className="pa-profile-fields">
                <div className="pa-field">
                  <label>Prénom affiché</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
                {nameMessage && <p className="pa-message">{nameMessage}</p>}
                <div className="pa-actions">
                  <button className="btn-ghost primary" type="submit" disabled={isSavingName}>
                    {isSavingName ? "Enregistrement..." : "Enregistrer le prénom"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>

        <section className="pa-section">
          <div className="pa-section-title">Compte</div>
          <form onSubmit={handleEmailSubmit}>
            <div className="pa-field">
              <label>Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {emailMessage && <p className="pa-message">{emailMessage}</p>}
            <div className="pa-actions">
              <button className="btn-ghost primary" type="submit" disabled={isSavingEmail}>
                {isSavingEmail ? "Envoi..." : "Changer l'email"}
              </button>
            </div>
          </form>
        </section>

        <section className="pa-section">
          <div className="pa-section-title">Sécurité</div>
          <form onSubmit={handleSubmit}>
            <div className="pa-field">
              <label>Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            {message && <p className="pa-message">{message}</p>}
            <div className="pa-actions">
              <button className="btn-ghost primary" type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

export default ParametresPage;