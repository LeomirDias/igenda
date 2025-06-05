import { db } from "@/db";
import { eq } from "drizzle-orm";
import { enterprisesTable } from "@/db/schema";

const BookingPage = async ({ params }: { params: { slug: string } }) => {
    const enterprise = await db.query.enterprisesTable.findFirst({
        where: eq(enterprisesTable.slug, params.slug),
    });
    if (!enterprise) {
        return <div>Enterprise not found</div>;
    }

    return (
        <div>
            <h1>Acesso feito via link de agendamento</h1>
        </div>
    );
}

export default BookingPage;