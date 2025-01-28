import { useRouter } from "next/router";
import nProgress from "nprogress";
import { useEffect } from "react";

export default function useUnsavedChangesWarning (condition: boolean){

    const router = useRouter();
    useEffect(() => {
        const beforeUnLoadHandler = (e: BeforeUnloadEvent) => {
            if(condition){
                e.preventDefault();
                e.returnValue = true;
            }
        }

        const routerChangeStartHandler = () => {
            if(condition && !window.confirm("You have unsaved changes. Do you want to leave the page?")){
                nProgress.done();
                throw "routerChange aborted";
            }
        }

        window.addEventListener("beforeunload", beforeUnLoadHandler);
        router.events.on("routeChangeStart", routerChangeStartHandler);

        return () => {
            window.removeEventListener("beforeunload", beforeUnLoadHandler);
            router.events.off("routeChangeStart", routerChangeStartHandler);
        }

    }, [condition, router.events])

}