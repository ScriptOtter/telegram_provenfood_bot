export async function currentSessionHandler(ctx) {
  await ctx.reply(JSON.stringify(ctx.session, null, 2));
}
