"use client";

// Re-exportado desde el Context real (`PhotoManifestContext`) para no tener
// que cambiar el import en cada componente que ya usa `usePhotoAvailable`
// (`ProductPlate`, `Product360Viewer`, `ProductGallery`, `ProductLightbox`,
// `PersonalizationConfigurator`, `EditCover`). Ver ese archivo para el
// porqué del cambio de fetch-en-cliente a Context calculado en el servidor.
export { usePhotoAvailable } from "@/context/PhotoManifestContext";
