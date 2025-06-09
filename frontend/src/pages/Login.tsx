import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { CircleAlertIcon } from "lucide-react"
import { FormProvider, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import * as z from "zod"
import image from "../../src/assets/png/amico.png"
import { useAuthStore } from "../api/auth"
import usePostLogin, { LoginRequest } from "../api/usePostLogin"
import { Button } from "../component/Button/button"
import { InputText } from "../component/InputText"
import { useToast } from "../component/Toast/hooks"
import { UserRoleEnum } from "../component/userRole"
import { cn } from "../component/utils"

// 1. Define schema
const loginSchema = z.object({
    username: z.string()
        .min(1, "Username tidak boleh kosong")
        .regex(/^[a-zA-Z0-9?!@"_]+$/, {
            message: "Username mengandung karakter yang tidak diperbolehkan",
        }),
    password: z.string()
        .min(1, "Password tidak boleh kosong")
        .regex(/^[a-zA-Z0-9?!@"_]+$/, {
            message: "Password mengandung karakter yang tidak diperbolehkan",
        }),
});

export const Login = () => {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    });
    const navigate = useNavigate();
    const loginUser = usePostLogin();
    const setRole = useAuthStore((state) => state.setRole);
    const { toast } = useToast();

    const handleLogin = form.handleSubmit((data) => {
        const adjustedData: LoginRequest = {
            username: data.username,
            password: data.password
        }
        loginUser.mutate(adjustedData, {
            onSuccess: (data) => {
                localStorage.setItem("user", data.data.id ?? "");
                setRole(data.data.role)
                navigate(data.data.role === UserRoleEnum.Admin ? "/admin/homePage" : "/home")
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    toast({
                        title: "Terjadi Kesalahan login!",
                        description: (error?.response?.data.message),
                        icon: <CircleAlertIcon className="text-warning-500" />,
                        duration: 5000,
                        className: "!max-w-[960px] w-full",
                    });
                } else {
                    toast({
                        title: "Terjadi Kesalahan login!",
                        description: (error as string),
                        icon: <CircleAlertIcon className="text-warning-500" />,
                        duration: 5000,
                        className: "!max-w-[960px] w-full",
                    });
                }
            }
        })
    })

    return (
        <div className="flex flex-col max-w-screen min-h-screen bg-[url('src/assets/png/Background.png')] bg-contain bg-bottom bg-no-repeat lg:bg-repeat-x"
            style={{ backgroundColor: 'color-mix(in oklab, #C7E9FE 68%, transparent 30%)' }}
        >
            <h1 className="text-4xl font-bold text-center md:text-left p-4">Logo</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-items-center lg:max-h-lvh">
                <div className={
                    cn(
                        "flex justify-center relative w-full h-[26svh] mt-5",
                        "md:h-[30lvh]",
                        "lg:w-[35dvw] lg:h-[45dvh] lg:-ml-40",
                        "xl:w-[70vh] xl:h-[60vh]"
                    )
                }>
                    <img
                    src={image}
                    alt="Login Image"
                        className="max-h-[100vh] w-[45vw]
                            lg:translate-y-20 lg:translate-x-10 "
                    />
                </div>
                
                <div className={
                    cn(
                        "flex flex-col justify-center items-center w-[80lvw] h-auto bg-white py-[12%] px-[10%] rounded-xl mt-12",
                        "md:py-[10%] md:mt-10",
                        "lg:translate-y-12 lg:w-[40vw] lg:max-h-[70svh] lg:h-fit lg:py-[15%] lg:px-[15%] lg:mt-10"
                    )
                }>
                    <FormProvider {...form}>
                        <div className="flex flex-col items-center justify-center gap-5 w-full xl:-mt-15">
                            <h1 className="text-4xl md:text-5xl font-bold italic text-[#0291E5] -translate-y-2">Login</h1>
                            {/* <p className="text-xs">Silahkan Masuk ke Akun Anda</p> */}
                            <div className="w-full mb-5 md:mb-7 lg:mb-3">
                                <InputText
                                    name="username"
                                    type="text"
                                    placeholder="ex: John Doe"
                                    label="Nama Pengguna"
                                />
                                <p className="text-[10px] text-red-500 -mb-10 lg:-mb-5">{form.formState.errors.username?.message}</p>
                            </div>
                            <div className="w-full mb-3 md:mb-5 lg:mb-2">
                                <InputText
                                    name="password"
                                    type="password"
                                    placeholder="ex: zI1EPDBLrPtLr4V"
                                    label="Kata Sandi"
                                />
                                <p className="text-[10px] text-red-500 -mb-5 lg:-mb-4">{form.formState.errors.password?.message}</p>
                            </div>
                            <Button onClick={handleLogin} className="w-full text-white">Masuk</Button>
                        </div>
                        <div className="flex flex-row items-center justify-center gap-1 mt-2 w-full">
                            <p className="text-xs">Belum memiliki akun?</p>
                            <p onClick={() => navigate("/register")} className="text-xs text-blue-600 cursor-pointer">Daftar</p>
                            <p className="text-xs">disini</p>
                        </div>
                    </FormProvider>
                </div>
            </div>
        </div>
    )
}
