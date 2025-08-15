"use server";
"use i18n";

export async function HeroSubtitle() {
  return (
    <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
      Localize your React app in every language in minutes.
      <br />
      Scale to millions from day one
      <sup title="supports many popular frameworks">*</sup>.
    </p>
  );
}
