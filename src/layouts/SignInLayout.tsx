
interface SignInLayoutProps {
    childrenHero : React.ReactNode;
    childrenForm : React.ReactNode;
}

export default function SignInLayout({ childrenHero, childrenForm }: SignInLayoutProps) {

    return (
        <section className="w-screen h-screen flex justify-center items-center">
            <div className = "w-screen h-screen flex flex-col justify-start items-start bg-primary">
                {childrenHero}
            </div>
            <div className = "w-screen h-screen flex flex-col justify-center items-center bg-secondary">
                {childrenForm}
            </div>
        </section>
    )
}
         