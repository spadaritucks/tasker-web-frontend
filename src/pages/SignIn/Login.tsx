import SignInLayout from "@/layouts/SignInLayout";
import LogoTasker from "@/assets/logo-tasker.png";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import Aspas from '@/assets/aspas.png'
import { Separator } from "@/components/ui/separator";
import { AuthService } from "@/api/services/auth/auth.service";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";




export default function Login() {

    const Navigate = useNavigate();



      const handleValidateToken = useMutation({
          mutationFn: (credencialResponse : CredentialResponse) =>
            AuthService.LoginGoogle({
                idToken : credencialResponse.credential ?? ""
            }),
    
          onSuccess: () => {
              Navigate("/home", { replace: true })
          },
        });

    return (
        <SignInLayout
            childrenHero={
                <>
                    <div className="flex flex-col justify-center items-start py-5">
                        <header className="flex justify-center items-center gap-0">
                            <div className="flex justify-center items-center gap-0 m-0">
                                <img src={LogoTasker} alt="Logo Tasker" className="w-40"></img>
                            </div>
                        </header>

                        <main className="flex flex-col justify-center items-start gap-0 p-12">
                            <span className="text-xs text-gray-300 font-semibold uppercase">organize, conclua, evolua.</span>
                            <h1 className="text-5xl font-bold text-white">Seu dia, mais leve <br /> e sob controle</h1>
                            <p className="text-xl text-white my-4">Centralize suas tarefas, lembretes e compromissos <br /> em um só lugar.</p>
                        </main>

                        <footer className="flex flex-col justify-center items-start gap-0 p-12">
                            <img src={Aspas} alt="Aspas" className="w-6 mb-4"></img>
                            <h2 className="text-[16px]  text-gray-300 mb-2 font-medium">O Tasker me ajuda a transformar uma lista mental <br /> em um plano claro para o dia.</h2>
                            <p className="font-bold text-xs text-secondary">Maria Beatriz Zandomeneghi</p>
                            <Separator   />
                        </footer>

                    </div>
                </>}
            childrenForm={
                <>
                    <div className="flex flex-col justify-center items-start">
                        <header className="flex justify-center items-center">
                            <div className="flex flex-col justify-center items-start">
                                <span className="text-xs text-primary font-bold uppercase ">Bem vindo de volta</span>
                                <h1 className="text-3xl font-semibold">Entre na Sua Conta</h1>
                                <p className="text-gray-400 my-2">Acesse seu espaço e continue de onde parou.</p>
                                
                            </div>
                        </header>

                        <main className="flex flex-col justify-center items-center gap-0 p-12 w-96">
                            <GoogleLogin width={384}
                                onSuccess={credentialResponse => {
                                    handleValidateToken.mutate(credentialResponse);
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                        </main>

                    </div>
                </>
            }
        />
    )
}
