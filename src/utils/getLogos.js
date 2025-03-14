export const getLogos = async () => {
  try {
    const res = await fetch(`/api/logo`, {
      cache: "no-store",
    });
    const logos = await res.json();

    return {
      dashboard:
        logos.find((logo) => logo.type === "dashboard")?.image ||
        "/assets/logo_pattern.png",
      site: logos.find((logo) => logo.type === "site")?.image || "/assets/logo.png",
    };
  } catch (error) {
    console.error("Error fetching logos:", error);
    return { dashboard: "/assets/logo_pattern.png", site: "/assets/logo.png" }; // Default fallback
  }
};
