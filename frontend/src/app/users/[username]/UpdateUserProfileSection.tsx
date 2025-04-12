"use client";

import FormInputField from "@/components/form/FormInputField";
import LoadingButton from "@/components/LoadingButton";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { User } from "@/models/users";
import * as UsersApi from "@/network/api/users";
import { useRouter } from "next/navigation";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface updateUserProfileSectionProps {
    user: User,
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validationSchema = yup.object({
    displayName: yup.string(),
    about: yup.string(),
    profilePic: yup.mixed<FileList>(),
});

type UpdatedUserProfileFormData = yup.InferType<typeof validationSchema>;




export default function UpdateUserProfileSection ({user: profileUser}: updateUserProfileSectionProps){

    const { user: loggedInUser, mutateUser: mutateLoggedInUser} = useAuthenticatedUser();

    const router = useRouter();

    const {register, handleSubmit, formState: { isSubmitting }} = useForm<UpdatedUserProfileFormData>();

    async function onSubmit({ displayName, about, profilePic}: UpdatedUserProfileFormData) {
        if(!displayName && !about && (!profilePic || profilePic.length ===0 )) return;

        try {
            const updatedUser = await UsersApi.updateUser({ displayName, about, profilePic: profilePic?.item(0) || undefined});
            handleUserUpdated(updatedUser);

        } catch (error) {
            console.error(error);
            alert(error);

        }
    }

    function handleUserUpdated (updatedUser: User){
        mutateLoggedInUser(updatedUser);
        router.refresh();
    }

    const profileUserIsLoggedInUser = (loggedInUser && (loggedInUser._id === profileUser._id)) || false;


    if(!profileUserIsLoggedInUser) return null;

    return (
        <div>
            <hr/>
            <h2>Update user</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormInputField
                register={register("displayName")}
                label="Display name"
                placeholder="Display name"
                maxLength={20}
                />

               <FormInputField
                register={register("about")}
                label="About"
                placeholder="About"
                as="textarea"
                maxLength={160}
                />

               <FormInputField
                register={register("profilePic")}
                type="file"
                accept="image/png, image/jpeg"
                label="Profile picture"
                maxLength={20}
                />

                <LoadingButton type="submit" isLoading={isSubmitting}>Update profile</LoadingButton>
            </Form>
        </div>
    )
}


