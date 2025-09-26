const seenByAll = (participants, userId, seenBy) => {
    let recipients = participants.filter((p) =>
        p._id.toString() !== userId.toString()
    );

    let seenByAll = true;
    for (const recipient of recipients) {
        if (!seenBy.some((r) =>
            r.recipientId.toString() === recipient._id.toString())
        ) {
            seenByAll = false;
        }
    }
    return seenByAll;
}
export default seenByAll;