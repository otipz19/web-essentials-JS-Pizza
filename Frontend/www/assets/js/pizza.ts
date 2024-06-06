import { Option } from "./option";

export type Pizza = {
    tag: string,
    img: string,
    title: string;
    subtitle: string;
    description: string;
    options: Option[];
}