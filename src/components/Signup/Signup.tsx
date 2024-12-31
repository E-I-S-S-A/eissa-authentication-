import { useForm } from "react-hook-form";
import { EissaButton, EissaCheckbox, EissaInputField, } from "react-reusable-elements";
import styles from "./Signup.module.css";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { REGEXES } from "../../constants/regexes";
import useUserHook from "../../hooks/useUserHook";

type FormData = {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
    isShowPassword: boolean;
};

interface SignupContext {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

const Signup = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, touchedFields },
        trigger,
        setError
    } = useForm<FormData>({ mode: "all" });
    const { checkIfEmailExists, sendOtp, verifyOtp, signup, checkIfUserIdExists } = useUserHook();
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const password = watch("password");
    const isShowPassword = watch("isShowPassword");

    const { step, setStep } = useOutletContext<SignupContext>();

    useEffect(() => {
        return onUnmount();
    }, []);

    const onUnmount = () => {
        setStep(1);
    };

    const onBackPress = () => {
        setStep((prev) => prev - 1);
    };

    const onSubmit = async (data: FormData) => {
        const fieldsToValidate: { [key: number]: (keyof FormData)[] } = {
            1: ["firstName"],
            2: ["email"],
            3: ["otp"],
            4: ["userId"],
            5: ["password", "confirmPassword"],
        };

        const isValid = await trigger(fieldsToValidate[step]);

        if (isValid) {

            switch (step) {
                case 1:
                    setStep((prev) => prev + 1);

                    break;
                case 2:
                    checkEmailAndSendOtp(data);
                    break;
                case 3:
                    verifyUserOtp(data);
                    break;
                case 4:

                    setStep((prev) => prev + 1);
                    break;
                case 5:
                    setStep((prev) => prev + 1);
                    console.log(data)
                    break;

                default:
                    break;
            }
        }
    };

    const checkEmailAndSendOtp = async (data: FormData) => {
        setIsLoading(true);
        try {
            const isEmailExists = await checkIfEmailExists(data.email);
            if (isEmailExists) {
                setError("email", {
                    message: "Email already exists"
                })

                return;
            }

            const isOtpSent = await sendOtp(data.email);
            if (isOtpSent) {
                setStep((prev) => prev + 1);
            }

        } catch (error) {
            if (error instanceof Error)
                setError("email", {
                    message: error.message
                })
        }
        setIsLoading(false);
    }

    const verifyUserOtp = async (data: FormData): Promise<void> => {
        try {
            const result = await verifyOtp(data.email, data.otp);
            if (result) {
                setStep((prev) => prev + 1);
            }
        } catch (error) {
            if (error instanceof Error)
                setError("otp", {
                    message: error.message
                })
        }
    }

    return (
        <div className={styles.signup_container}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.fields}>
                    {
                        step === 1 &&
                        <>
                            <EissaInputField
                                label="First name"
                                name="firstName"
                                register={register}
                                error={errors?.firstName}
                                rules={{
                                    required: {
                                        message: "First name is required",
                                        value: true,
                                    },
                                }}
                                isTouched={touchedFields?.firstName}
                            />
                            <EissaInputField
                                label="Last name (optional)"
                                name="lastName"
                                register={register}
                                error={errors?.lastName}
                                isTouched={touchedFields?.lastName}
                            />
                        </>
                    }
                    {
                        step === 2 &&
                        <EissaInputField
                            label="Email"
                            name="email"
                            register={register}
                            error={errors?.email}
                            rules={{
                                required: {
                                    message: "Email is required",
                                    value: true,
                                },
                                pattern: {
                                    message: "Invalid email",
                                    value: REGEXES.email,
                                },
                            }}
                            isTouched={touchedFields?.email}
                        />
                    }
                    {
                        step === 3 &&
                        <EissaInputField
                            label="Verify OTP"
                            name="otp"
                            register={register}
                            error={errors?.otp}
                            rules={{
                                required: {
                                    message: "OTP is required",
                                    value: true,
                                },
                            }}
                            isTouched={touchedFields?.otp}
                        />
                    }
                    {
                        step === 4 &&
                        <EissaInputField
                            label="Eissa Id"
                            name="userId"
                            register={register}
                            error={errors?.userId}
                            rules={{
                                required: {
                                    message: "Eissa Id is required",
                                    value: true,
                                },
                            }}
                            isTouched={touchedFields?.userId}
                        />
                    }
                    {
                        step === 5 &&
                        <>
                            <EissaInputField
                                label="Password"
                                type={isShowPassword ? "text" : "password"}
                                name="password"
                                register={register}
                                error={errors?.password}
                                rules={{
                                    required: {
                                        message: "Password is required",
                                        value: true,
                                    },
                                    pattern: {
                                        message: "Password must be 8+ characters with a letter, number, and special character.",
                                        value: REGEXES.password,
                                    },
                                }}
                                isTouched={touchedFields?.password}
                            />
                            <EissaInputField
                                label="Confirm password"
                                type={isShowPassword ? "text" : "password"}
                                name="confirmPassword"
                                register={register}
                                error={errors?.confirmPassword}
                                rules={{
                                    required: {
                                        message: "Confirm your password",
                                        value: true,
                                    },
                                    validate: (value) =>
                                        password === value ||
                                        "Passwords do not match",
                                }}
                                isTouched={touchedFields?.confirmPassword}
                            />
                            <EissaCheckbox label="Show password" name="isShowPassword" register={register} />
                        </>
                    }

                    {step === 1 && (
                        <p className={styles.signin_text}>
                            Already have an account?
                            <Link
                                to={ROUTES.auth.signin}
                                className={styles.link}
                            >
                                Sign In
                            </Link>
                        </p>
                    )}
                </div>
                <div className={styles.buttons}>
                    {step > 1 && (
                        <EissaButton
                            label="Back"
                            type="button"
                            variant="secondary"
                            onClick={onBackPress}
                        />
                    )}
                    <EissaButton
                        label={step < 5 ? "Next" : "Sign Up"}
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                    />
                </div>
            </form>
        </div>
    );
};

export default Signup;
