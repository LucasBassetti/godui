import { WORKBENCH_PREFS_KEY } from "@/lib/workbench-prefs";

/**
 * Applies the persisted Workbench pane state to <html> before React hydrates —
 * the same trick next-themes uses for the color scheme.
 *
 * This is what lets the split pane be server-rendered without a flash and
 * without a hydration mismatch: the markup is byte-identical whether the pane
 * is open or collapsed, because only the `data-wb-*` attributes and the width
 * custom properties differ, and CSS resolves both before first paint. React
 * reads the same attributes back via useSyncExternalStore.
 *
 * An explicit `?panel=` / `?code=` in the URL wins over the stored preference so
 * shared links land on what the author intended. Both panes default closed —
 * the stage is what the page is for; the docs open on request and stay open
 * afterwards.
 */
export function WorkbenchPrefsScript() {
  const script = `(function(){try{
var p=JSON.parse(localStorage.getItem(${JSON.stringify(WORKBENCH_PREFS_KEY)})||"{}");
var q=new URLSearchParams(location.search);
var d=document.documentElement;
var open=q.has("panel")?q.get("panel")==="1":p.open===true;
d.dataset.wbPanel=open?"open":"closed";
var code=q.has("code")?q.get("code")==="1":p.codeOpen===true;
if(code)d.dataset.wbCode="open";
if(p.panelW)d.style.setProperty("--wb-panel-user",p.panelW+"px");
if(p.codeH)d.style.setProperty("--wb-code-user",p.codeH+"px");
}catch(e){}})()`;

  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: static, self-authored bootstrap that must run before hydration
    <script dangerouslySetInnerHTML={{ __html: script }} />
  );
}
