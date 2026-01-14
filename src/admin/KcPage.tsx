/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260500.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "admin/KcPage.tsx" --revert
 */

import { lazy } from "react";
import { KcAdminUiLoader } from "./KcAdminUiLoader";
import type { KcContext } from "./KcContext";
import { oidcEarlyInit } from "oidc-spa/entrypoint";
import { browserRuntimeFreeze } from "oidc-spa/browser-runtime-freeze";
import { DPoP } from "oidc-spa/DPoP";

const { shouldLoadApp } = oidcEarlyInit({
    BASE_URL: location.pathname,
    securityDefenses: {
        ...browserRuntimeFreeze(),
        ...DPoP({ mode: "auto" })
    }
});

const KcAdminUi = lazy(() => import("./KcAdminUi"));

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    if( !shouldLoadApp ){
        return null;
    }

    return <KcAdminUiLoader kcContext={kcContext} KcAdminUi={KcAdminUi} darkModePolicy="auto" />;
}
