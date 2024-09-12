import { Separator } from "@/components/ui/separator";
import { AppearanceForm } from "./appearance-form";
import { ThemeCustomizer } from "./ThemeCoustomizer";

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the app. Automatically switch between day
          and night themes.
        </p>
      </div>
      <Separator />
      {/* <ThemeCustomizer /> */}
      <div className="flex">
        <AppearanceForm />
      </div>
    </div>
  );
}
