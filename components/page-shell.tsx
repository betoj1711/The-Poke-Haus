import {ReactNode} from 'react';import {SiteHeader} from './site-header';import {Footer} from './footer';
export function PageShell({children}:{children:ReactNode}){return <><SiteHeader/><main>{children}</main><Footer/></>}
