export type TNewContact = {
    _id?: string | undefined;
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    contact_profile_photo: string;
    is_private: boolean;
}