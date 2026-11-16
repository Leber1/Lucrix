"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { SidebarDrawer } from "@/components/layout/SidebarDrawer";
import { QuickActionsModal } from "@/components/layout/QuickActionsModal";
import { ProductWizardModal } from "@/components/modules/ProductWizardModal";
import { SaleModal } from "@/components/modules/SaleModal";
import { MarketingStoryModal } from "@/components/modules/MarketingStoryModal";
import { ExportReportModal } from "@/components/modules/ExportReportModal";
import { InstallPwaModal } from "@/components/modules/InstallPwaModal";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isProductWizardOpen, setIsProductWizardOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isMarketingModalOpen, setIsMarketingModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isInstallPwaModalOpen, setIsInstallPwaModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col bg-dark-950 pb-20">
      {/* Top Navbar */}
      <Navbar onOpenMenu={() => setIsMenuOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
        {children}
      </main>

      {/* Fixed Bottom Navigation (Mobile + Desktop Fixed) */}
      <BottomNav onOpenQuickActions={() => setIsQuickActionsOpen(true)} />

      {/* Sidebar Drawer Menu (Top Left 3 lines) */}
      <SidebarDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* Quick Actions Action Sheet (Center '+' Button) */}
      <QuickActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onOpenProductWizard={() => setIsProductWizardOpen(true)}
        onOpenSaleModal={() => setIsSaleModalOpen(true)}
        onOpenMarketingModal={() => setIsMarketingModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenInstallPwaModal={() => setIsInstallPwaModalOpen(true)}
      />

      {/* Modal Guiado em 5 Etapas de Cadastro de Produto */}
      <ProductWizardModal
        isOpen={isProductWizardOpen}
        onClose={() => setIsProductWizardOpen(false)}
      />

      {/* Modal de Nova Venda & PDV */}
      <SaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
      />

      {/* Modal de Gerador de Prints de Marketing (Stories) */}
      <MarketingStoryModal
        isOpen={isMarketingModalOpen}
        onClose={() => setIsMarketingModalOpen(false)}
      />

      {/* Modal de Exportação de Dados por Data Personalizada */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Modal de Instalação PWA no Celular */}
      <InstallPwaModal
        isOpen={isInstallPwaModalOpen}
        onClose={() => setIsInstallPwaModalOpen(false)}
      />
    </div>
  );
};
