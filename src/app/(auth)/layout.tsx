import React from "react";

function AuthLayout({ children }: { children: React.ReactNode }) {
    return <div className="h-full w-full grid place-items-center">{children}</div>;
}

export default AuthLayout;
