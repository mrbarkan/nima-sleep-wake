import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "@/components/features/user/UserMenu";
import { SyncIndicator } from "./SyncIndicator";
import { LanguageSelector } from "@/components/features/language";

const Header = () => {
  const { t } = useTranslation('common');

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold">{t('appName')}</h1>
            <Badge variant="outline" className="text-xs">{t('beta')}</Badge>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <LanguageSelector />
            <SyncIndicator />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
