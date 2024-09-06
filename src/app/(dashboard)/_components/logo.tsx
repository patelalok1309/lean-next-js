import Image from "next/image";

export const Logo = () => {
    return (
        <Image
            priority
            height={130}
            width={130}
            alt="logo"
            src="/logo.svg"
            style={{ width: "auto" }}
        />
    );
};
