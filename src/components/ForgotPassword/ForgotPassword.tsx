import { useForm } from "react-hook-form";
import { EissaButton, EissaCheckbox, EissaInputField, } from "react-reusable-elements";
import styles from "./ForgotPassword.module.css";
import { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { REGEXES } from "../../constants/regexes";

type FormData = {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
    isShowPassword: boolean;
};

interface ForgotPasswordContext {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

const ForgotPassword = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, touchedFields },
        trigger,
    } = useForm<FormData>({ mode: "all" });
    const location = useLocation();

    const password = watch("password");
    const isShowPassword = watch("isShowPassword");

    const { step, setStep } = useOutletContext<ForgotPasswordContext>();

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
            1: ["email"],
            2: ["otp"],
            3: ["password", "confirmPassword"],
        };

        const isValid = await trigger(fieldsToValidate[step]);

        if (isValid) {
            if (step === 4) {
                console.log(data);
            }
            setStep((prev) => prev + 1);
        }
    };

    return (
        <div className={styles.forgot_password_container}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.fields}>
                    {
                        step === 1 &&
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
                        step === 2 &&
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
                        step === 3 &&
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
                            Already know your password?
                            <Link
                                to={{ pathname: ROUTES.auth.signin, search: location.search }}
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
                        label={step < 3 ? "Next" : "Reset Password"}
                        type="submit"
                        variant="primary"
                    />
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
