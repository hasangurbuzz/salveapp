import {Post} from "@/lib/types/Post";
import PostListItem from "@/app/_components/PostListItem";

type Props = {
    data: Post[]
}

export default function PostList(props: Props) {

    const {data} = props

    return (
        <div className={"flex flex-col w-full items-center space-y-4"}>

            {data.length > 0 &&
                data.map(
                    (item, count) => {
                        return <PostListItem key={count} post={item}/>
                    }
                )
            }
            {data.length === 0 && <div>Not found</div>}
        </div>
    )
}