export async function currentSessionHandler(ctx) {
  ctx.reply(JSON.stringify(ctx.session, null, 2));
}
