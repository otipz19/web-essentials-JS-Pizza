import { Option } from "./option";

export type Pizza = {
    id: number,
    tag: string,
    img: string,
    title: string,
    subtitle: string,
    categories: string[],
    description: string,
    options: Option[],
}