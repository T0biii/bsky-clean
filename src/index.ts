import { BskyAgent } from "@atproto/api";

if (Bun.argv.length < 4 || Bun.argv.length > 5) {
    throw new Error(`Invalid argument length. Needs <identifier> <password> <server>`)
}

let SERVER
if (Bun.argv.length == 5){
    SERVER = Bun.argv[4];
}else{
    SERVER = "bsky.social";
}

const USER_IDENTIFIER = Bun.argv[2];
const PASSWORD = Bun.argv[3];

const agent = new BskyAgent({ service: "https://"+SERVER });
await agent.login({
    identifier: USER_IDENTIFIER,
    password: PASSWORD,
});

const getPostAndDelete = async (cursor?: string | undefined) => {
    const profile = await agent.getAuthorFeed({
        actor: USER_IDENTIFIER,
        limit: 100,
        cursor
    });
    for (const post of profile.data.feed) {
        if (post.post.author.handle === USER_IDENTIFIER) {
            await agent.deletePost(post.post.uri);
        } else if(post.post.viewer?.repost) {
            await agent.deleteRepost(post.post.viewer.repost);
        }
    }
    if (profile.data.cursor) {
        await getPostAndDelete(profile.data.cursor);
    }
}
await getPostAndDelete();
