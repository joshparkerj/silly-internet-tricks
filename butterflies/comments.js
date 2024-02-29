JSON.stringify(
 x.filter(({ source_type: type }) => type === 'post_comment')
  .map((
   {
    post_comment_id: id,
    post_comments: {
     posts: {
      description: post,
      slug,
     },
     body: comment,
     post_comments: replies,
    },
    receiver_profile: { username },
   },
  ) => (
   {
    username,
    post,
    comment,
    reply: replies[0]?.body,
    link: `https://www.butterflies.ai/users/${username}/p/${slug}?comment_id=${id}`,
   }
  )),
);
