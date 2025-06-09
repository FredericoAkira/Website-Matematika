/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { CircleAlertIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import * as z from "zod"
import image from "../../src/assets/png/amico.png"
import { useAuthStore } from "../api/auth"
import useGetLOV from "../api/useGetLOV"
import usePostRegister, { RegistrationRequest } from "../api/usePostRegister"
import { Button } from "../component/Button/button"
import { InputSelect } from "../component/InputSelect/InputSelect"
import { InputText } from "../component/InputText"
import { useToast } from "../component/Toast/hooks"
import { cn } from "../component/utils"

const registerSchema = z.object({
    username: z.string()
        .min(1, "Username tidak boleh kosong")
        .regex(/^[a-zA-Z0-9?!@"_]+$/, {
            message: "Username mengandung karakter yang tidak diperbolehkan",
        }),
    email: z
        .string()
        .min(1, "Email tidak boleh kosong")
        .max(50, "Email harus dibawah 50 karakter")
        .regex(
        /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
        {
            message:
            "Email harus dimulai dengan karakter alfanumerik dan hanya boleh mengandung simbol titik (.), sambung (-), atau underscore",
        },
        ),
    password: z.string()
        .min(1, "Password tidak boleh kosong")
        .regex(/^[a-zA-Z0-9?!@"_]+$/, {
            message: "Kata sandi mengandung karakter yang tidak diperbolehkan",
        }),
    role: z.string()
        .min(1, "Role harus dipilih"),
    confirmPassword: z.string()
        .min(1, "Konfirmasi kata sandi harus diisi"),
    grade: z.string().min(1, "Kelas harus dipilih")

}).superRefine(
    (
      {email},
      ctx,
    ) => {
        if (!email || !/^\S+@\S+\.\S+$/.test(email as string)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Gunakan format email yang sesuai",
            path: ["email"],
          });
        }
})

export const Register = () => {

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: {
            username: "",
            email:"",
            password:"",
            grade:""
        }
    });

    useEffect(() => {
        const subscription = form.watch(() => {
          form.trigger(); // re-triggers validation on any field change
        });
        return () => subscription.unsubscribe();
    }, [form]);

    const navigate = useNavigate();
    const registerUser = usePostRegister();
    const setRole = useAuthStore((state) => state.setRole);
    const { toast } = useToast();
    const [errorConfirm, setErrorConfrim] = useState<string | undefined>(undefined);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const optionGrade = useGetLOV();
    useEffect(() => {
        optionGrade.mutate({
            type: "gradelov",
            search: searchValue
        })
    }, [searchValue]);

    const handleRegister = form.handleSubmit((data) => {
        const adjustedData: RegistrationRequest = {
            username: data.username,
            email: data.email,
            password: data.password,
            role: data.role === "siswa" ? "STUDENT" : "TEACHER"
        }
        if (form.watch("confirmPassword") !== data.password) {
            setErrorConfrim( "Konfirmasi tidak cocok");
            return;
        }
        registerUser.mutate(adjustedData, {
            onSuccess: (data) => {
                localStorage.setItem("user", data.body.data.id ?? "");
                setRole(data.body.data.role)
                navigate("/home")
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    toast({
                        title: "Terjadi Kesalahan Registrasi!",
                        description: (error?.response?.data.message),
                        icon: <CircleAlertIcon className="text-warning-500" />,
                        duration: 5000,
                        className: "!max-w-[960px] w-full",
                    });
                } else {
                    toast({
                        title: "Terjadi Kesalahan Registrasi!",
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
            <div className={`grid grid-cols-1 ${!form.watch("role") ? "lg:grid-cols-2" : ""} items-center justify-items-center`}>
                {!form.watch("role") && (
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
                                lg:translate-y-8 lg:translate-x-10 "
                        />
                    </div>
                )}

                <div className={
                    cn(
                        `flex flex-col w-[80svw] ${!form.watch("role") ? "h-[45vh] lg:h-[70dvh] translate-y-8 justify-center lg:w-[40dvw]" : "h-fit translate-y-12 lg:translate-y-0"} bg-white py-8 px-[15%] lg:px-[5%] rounded-xl`
                    )
                }>
                    <FormProvider {...form}>
                        {!form.watch("role") ? (
                            <div className="flex flex-col items-center justify-center gap-5 w-full -mt-5 xl:-translate-y-2">
                                <h1 className="text-4xl md:text-5xl font-bold italic text-[#0291E5] -translate-y-5">Signup</h1>
                                <p className="text-sm font-bold">Daftar Sebagai</p>
                                <Button onClick={() => form.setValue("role", "TEACHER")} className="w-full text-white text-md">Guru</Button>
                                <p className="text-sm">atau</p>
                                <Button onClick={() => form.setValue("role", "STUDENT")} className="w-full text-[#0291E5] text-md" variant={"outline"}>Siswa</Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-5 w-full">
                                <h1 className="text-[24px] xl:text-[33px] font-bold italic text-[#0291E5] xl:-translate-y-2">Signup - {form.getValues("role") === "TEACHER" ? "Guru" : "Siswa"}</h1>
                                <div className="w-full mb-1">
                                    <InputText
                                        name="username"
                                        type="text"
                                        placeholder="ex: John Doe"
                                        label="Nama Pengguna"
                                        required
                                    />
                                    <p className="text-[10px] text-red-500 -mb-5 lg:-mb-5">{form.formState.errors.username?.message}</p>
                                </div>
                                <div className="w-full mb-1">
                                    <InputText
                                        name="email"
                                        type="email"
                                        placeholder="ex: johnDoe@gmail.com"
                                        label="Alamat Email Pengguna"
                                        required
                                    />
                                    <p className="text-[10px] text-red-500 -mb-5 lg:-mb-5">{form.formState.errors.email?.message}</p>
                                </div>
                                <div className=" relative w-full mb-1">
                                    <InputText
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="ex: zI1EPDBLrPtLr4V"
                                        label="Kata Sandi"
                                        required
                                    />
                                    <div
                                        className="absolute -mt-4 right-2 -translate-y-1/2 cursor-pointer text-gray-400"
                                        onClick={() => setShowPassword(!showPassword)}
                                        >
                                        {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                    </div>
                                    <p className="text-[10px] text-red-500 -mb-5 lg:-mb-5">{form.formState.errors.password?.message}</p>
                                </div>
                                <div className="relative w-full">
                                    <InputText
                                        name="confirmPassword"
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="ex: zI1EPDBLrPtLr4V"
                                        label="Konfirmasi Kata Sandi"
                                        required
                                    />
                                    <div
                                        className="absolute -mt-4 right-2 -translate-y-1/2 cursor-pointer text-gray-400"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        >
                                        {showConfirm ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                    </div>
                                    {errorConfirm && (<p className="text-[10px] text-red-500 -mb-5 lg:-mb-5">{errorConfirm}</p>)}
                                </div>
                                <div className="relative w-full -mt-2 mb-3">
                                    <InputSelect
                                        onChange={(value) => {
                                            form.setValue("grade", value?.value ?? "");
                                        }}
                                        handleSearch={setSearchValue}
                                        options={optionGrade.data?.data.data.map((item) => (
                                            {
                                                meaning: item.id,
                                                value: item.name
                                            }
                                        ))}
                                        name="grade"
                                        label="Kelas"
                                        required
                                        value={form.watch("grade")}
                                        inForm
                                    />
                                    <p className="text-[10px] text-red-500 -mb-5 lg:-mb-5">{form.formState.errors.grade?.message}</p>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between w-full gap-2">
                                    <Button onClick={handleRegister} disabled={!form.formState.isValid} className="text-white md:text-[15px]">Buat Akun</Button>
                                    <Button onClick={() => navigate(-1)} className="text-[#0291E5] md:text-[15px]" variant={"outline"}>Kembali</Button>
                                </div>
                            </div>
                        )}
                    </FormProvider>
                </div>
            </div>

        </div>
    )

}