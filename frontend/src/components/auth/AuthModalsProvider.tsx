import { createContext, ReactNode, useState } from "react"
import ResetPasswordModal from "./ResetPasswordModal";
import SignUpModal from "./SignUpModal";
import LogInModal from "./LogInModal";


interface AuthModalsContext {
    showLoginModal: () => void,
    showSignUpModal: () => void,
    showResetPasswordModal: () => void,
}

export const AuthModalsContext = createContext<AuthModalsContext>({
    showLoginModal: () => { throw Error ("AuthModalsContext not implemented.") },
    showSignUpModal: () => { throw Error ("AuthModalsContext not implemented.") },
    showResetPasswordModal: () => { throw Error ("AuthModalsContext not implemented.") },
});


interface AuthModalsProviderProps{
    children: ReactNode 
}

export default function AuthModalsProvider ( { children } : AuthModalsProviderProps){

    const [showLogInModal, setShowLogInModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

    const [value] = useState ({
        showLoginModal: () => setShowLogInModal(true),
        showSignUpModal: () => setShowSignUpModal(true),
        showResetPasswordModal: () => setShowResetPasswordModal(true),
    });

    return(
        <AuthModalsContext.Provider value={value}>
        {children}

        {showLogInModal && 
        <LogInModal
        onDismiss={ () => setShowLogInModal(false)}
        onSignUpInsteadClicked={ () => {
            setShowLogInModal(false);
            setShowSignUpModal(true);
        }}
        onForgotPasswordClicked={ () => {
            setShowLogInModal(false);
            setShowResetPasswordModal(true);
        }}
        />
        }

        {showSignUpModal && 
        <SignUpModal
        onDismiss={ () => setShowSignUpModal(false)}
        onLoginInsteadClicked={ () => {
            setShowSignUpModal(false);
            setShowLogInModal(true);
        }}
        />
        }

        {showResetPasswordModal && 
        <ResetPasswordModal 
        onDismiss={() => setShowResetPasswordModal(false)}
        onSignUpClicked={() => {
            setShowResetPasswordModal(false);
            setShowSignUpModal(true);
        }}
        />
        }
        </AuthModalsContext.Provider>
    );
}