/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type SignInInputValues = {
    email?: string;
    password?: string;
};
export declare type SignInValidationValues = {
    email?: ValidationFunction<string>;
    password?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SignInOverridesProps = {
    SignInGrid?: PrimitiveOverrideProps<GridProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    password?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type SignInProps = React.PropsWithChildren<{
    overrides?: SignInOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: SignInInputValues) => SignInInputValues;
    onSuccess?: (fields: SignInInputValues) => void;
    onError?: (fields: SignInInputValues, errorMessage: string) => void;
    onChange?: (fields: SignInInputValues) => SignInInputValues;
    onValidate?: SignInValidationValues;
} & React.CSSProperties>;
export default function SignIn(props: SignInProps): React.ReactElement;
