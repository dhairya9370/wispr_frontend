const deliveredToAll = (participants, userId, deliveredTo) => {
    let recipients = participants.filter((p) =>
        p._id.toString() !== userId.toString()
    );

    let deliveredToAll = true;
    for (const recipient of recipients) {
        if (!deliveredTo.some((r) =>
            r.recipientId.toString() === recipient._id.toString())
        ) {
            deliveredToAll = false;
        }
    }
    return deliveredToAll;
}
export default deliveredToAll;