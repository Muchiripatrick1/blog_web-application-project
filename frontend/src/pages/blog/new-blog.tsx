import { Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as BlogApi from "@/network/api/blog";
import FormInputField from "@/components/form/FormInputField";
import MarkDownEditor from "@/components/form/MarkDownEditor";
import { generateSlug } from "@/utils/utils";
import LoadingButton from "@/components/LoadingButton";
import { useRouter } from "next/router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { requiredFileSchema, requiredStringSchema, slugSchema } from "@/utils/validation";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import useUnsavedChangesWarning from "@/hooks/useUnsavedChangesWarning";


const validationSchema = yup.object({
    slug: slugSchema.required("Required"),
    title: requiredStringSchema,
    summary: requiredStringSchema,
    body: requiredStringSchema,
    featuredImage: requiredFileSchema,
});

type blogPostFormDataValues = yup.InferType<typeof validationSchema>;



export default function CreatBlogPostPape (){

    const { user, userLoading } = useAuthenticatedUser();

    const router = useRouter();

    const {  register, handleSubmit, getValues, setValue, watch, formState: {errors, isSubmitting, isDirty}  } = useForm<blogPostFormDataValues>({
        resolver: yupResolver(validationSchema)
    });


    async function onSubmit({title, slug, summary, featuredImage, body}: blogPostFormDataValues) {
        try {
            await BlogApi.createBlogPost({title, slug, summary, featuredImage:featuredImage[0], body});
           // alert("post created succesfully");
            await router.push("/blog/"+ slug);
        } catch (error) {
            console.error(error)
            alert(error)
        }
    }


    function generateSlugFromTitle(){
        if (getValues("slug"))return
        const slug = generateSlug(getValues("title"));
        setValue("slug", slug, {shouldValidate: true});
    }

    useUnsavedChangesWarning(isDirty && !isSubmitting);
    
    if(!userLoading && !user) router.push("/");

    if(userLoading)
        {return <Spinner animation="border" className="d-block m-auto"/>}

    return(
        <>
        <h1>Create a Blog</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormInputField
            label="Post title"
            register={register("title")}
            placeholder="Post title"
            maxLength={100}
            error={errors.title}
            onBlur={generateSlugFromTitle}
            />

            <FormInputField
            label="Post slug"
            register={register("slug")}
            placeholder="Post slug"
            maxLength={100}
            error={errors.slug}
            />
            
            <FormInputField
            label="Post summary"
            register={register("summary")}
            placeholder="Post summary"
            maxLength={300}
            as="textarea"
            error={errors.summary}/>
            
            <FormInputField
            label="Post image"
            register={register("featuredImage")}
            type="file"
            accept="image/png, image/jpeg"
            error={errors.featuredImage}
            />

            <MarkDownEditor
            label="Post body"
            register={register("body")}
            watch={watch}
            setValue={setValue}
            error={errors.body}
            />
            
    
            <LoadingButton type="submit" isLoading={isSubmitting}>Create Blog</LoadingButton>
        </Form>
        </>
    )
}