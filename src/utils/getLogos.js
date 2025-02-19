export const getLogos = async () => {
  try {
    const res = await fetch(`/api/logo`, {
      cache: "no-store",
    });
    const logos = await res.json();

    return {
      dashboard:
        logos.find((logo) => logo.type === "dashboard")?.image ||
        "/logo_pattern.png",
      site: logos.find((logo) => logo.type === "site")?.image || "/logo.png",
    };
  } catch (error) {
    console.error("Error fetching logos:", error);
    return { dashboard: "/logo_pattern.png", site: "/logo.png" }; // Default fallback
  }
};
