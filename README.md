
# Keycloak Admin UI 26.5.0 with DPoP

<img width="4108" alt="Image" src="https://github.com/user-attachments/assets/eb0650d3-b2a2-4de9-b078-538acc8b75a5" />

This repo tracks Keycloak Admin Console 26.5.0 with a minimal swap of `keycloak-js` for [oidc-spa/keycloak-js](https://docs.oidc-spa.dev/docs/v10/resources/migrating-from-keycloak-js).  
It is a drop-in replacement; see the [small diff](https://github.com/garronej/keycloak-admin-ui-dpop/commit/0620b67a3fd048006ba5088836ba9b259876ba88#r174574371).

<p align="center">
    <a href="https://github.com/garronej/keycloak-admin-ui-dpop/commit/0620b67a3fd048006ba5088836ba9b259876ba88#r174574371">
        <img src="https://github.com/user-attachments/assets/fe9146d8-318e-4eca-8a51-764c9dc6521c" width="420">
    </a>
</p>

**Motivation**

- Security
  - [DPoP](https://docs.oidc-spa.dev/docs/v10/security-features/dpop).
  - [Browser runtime freeze](https://docs.oidc-spa.dev/docs/v10/security-features/browser-runtime-freeze) to harden against dependency compromise/XSS.
  - [Single redirect URI](https://docs.oidc-spa.dev/docs/v10/providers-configuration/keycloak#clientid): remove `/admin/<realm>/console/*` wildcard.
  - Allow response mode `fragment` instead of `query`.  
  - Moving AS response from the URL to memory before it can be intercepted.  
- UX/perf
  - Faster init, fewer layout shifts.
  - Cross-tab login/logout propagation without `login-status-iframe.html` warnings.
  - Idle Session Lifetime is respected; no abrupt redirect to login on "Save". A session-expiry warning overlay (demo: https://youtu.be/Z8zIjZx6DK4?si=9rdPntNXLuaFIcHf&t=1256) could be added, but is intentionally omitted to keep the diff minimal.

Init sequence (keycloak-js vs oidc-spa):  

https://github.com/user-attachments/assets/039b4442-d3f0-4363-8f6e-543b2816dc65  

Demo talk: https://youtu.be/Z8zIjZx6DK4?si=VTIaGuGqrhXOd3RN&t=1060

**Running locally**

```bash
git clone https://github.com/garronej/keycloak-admin-ui-dpop
cd keycloak-admin-ui-dpop
npm install
npm run start-keycloak # Select Keycloak 26.5
# Navigate to https://mytheme.keycloakify.dev
# Log-in with testuser/password123
# Click on the Account Console Link.
```

**Deploying the theme**

```bash
npm run build-keycloak-theme
```

JAR output: `dist_keycloak/keycloak-admin-dpop.jar`.  
In Keycloak, select `keycloak-dpop` as the admin theme.

**Session restoration method**

oidc-spa defaults to iframe-based session restoration for best performance. To switch to a full-page redirect:

```diff
 const { shouldLoadApp } = oidcEarlyInit({
     BASE_URL: location.pathname,
     securityDefenses: {
         ...browserRuntimeFreeze(),
         ...DPoP({ mode: "auto" })
     },
+    sessionRestorationMethod: "full page redirect"
 });
```

Performance with `sessionRestorationMethod: "full page redirect"`:  

https://github.com/user-attachments/assets/9aed07f5-3f81-4251-af87-ba395a5abb81  

**WebCrypto and secure context**

oidc-spa uses `crypto.subtle` for DPoP, which requires a secure context. For non-localhost, non-TLS deployments, oidc-spa can lazily load an optional WebCrypto polyfill [with no bundle size impact](https://docs.oidc-spa.dev/docs/v10/resources/bundle-size#example-bundle-visualization).  

**What's next**

Keycloakify-based [Account SPA](https://docs.keycloakify.dev/theme-types/account-theme/single-page) and [Admin](https://docs.keycloakify.dev/theme-types/admin-theme) themes will default to oidc-spa.
