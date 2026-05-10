import { HttpInterceptorFn } from "@angular/common/http";
import { tap } from "rxjs";

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    const startTime = Date.now();
    console.log(`➡️ ${req.method} ${req.url}`);

    return next(req).pipe(
        tap({
            next: (event) => {
            // event.type === 4 es HttpEventType.Response (la response final)
            if ((event as any).type === 4) {
                const elapsed = Date.now() - startTime;
                console.log(
                    `⬅️ ${req.method} ${req.url} → ${(event as any).status} in ${elapsed}ms`
                );
            }
        },
        error: (err) => {
            const elapsed = Date.now() - startTime;
            console.error(
                `❌ ${req.method} ${req.url} → ${err.status} in ${elapsed}ms`,
                err.message
            );
            }
        })
    );
};
