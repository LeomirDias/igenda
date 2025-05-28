import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, text, time, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: text("id").primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
    usersToEnterprises: many(usersToEnterprisesTable),
}));

export const sessionsTable = pgTable("sessions", {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' })
});

export const accountsTable = pgTable("accounts", {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const verificationsTable = pgTable("verifications", {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at')
});

export const usersToEnterprisesTable = pgTable("users_to_enterprises", {
    userId: text("user_id")
        .notNull()
        .references(() => usersTable.id),
    enterpriseId: uuid("enterprise_id")
        .notNull()
        .references(() => enterprisesTable.id),
    createdAT: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const usersToEnterprisesTableRelations = relations(usersToEnterprisesTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [usersToEnterprisesTable.userId],
        references: [usersTable.id],
    }),
    enterprise: one(enterprisesTable, {
        fields: [usersToEnterprisesTable.enterpriseId],
        references: [enterprisesTable.id],
    }),
}));

export const enterprisesTable = pgTable("enterprises", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    avatarImageURL: text("avatar_image_url"),
    phoneNumber: text("phone_number").notNull(),
    instagramURL: text("instagram_url"),
    register: text("register").notNull(),
    createdAT: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const enterpriseTablesRelations = relations(enterprisesTable, ({ many }) => ({
    professionals: many(professionalsTable),
    clients: many(clientsTable),
    appointments: many(appointmentsTable),
    usersToEnterprises: many(usersToEnterprisesTable),
}));

export const professionalsTable = pgTable("professionals", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    avatarImageURL: text("avatar_image_url"),
    description: text("description"),
    phoneNumber: text("phone_number").notNull(),
    instagramURL: text("instagram_url"),
    availableFromWeekDay: integer("available_from_week_day").notNull(),
    availableToWeekDay: integer("available_to_week_day").notNull(),
    availableFromTime: time("available_from_time").notNull(),
    availableToTime: time("available_to_time").notNull(),
    specialty: text("specialty").notNull(),
    createdAT: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
    //Relationships
    enterpriseId: uuid("enterprise_id")
        .notNull()
        .references(() => enterprisesTable.id, { onDelete: "cascade" }),
});

export const professionalsTableRelations = relations(professionalsTable, ({ many, one }) => ({
    enterprise: one(enterprisesTable, {
        fields: [professionalsTable.enterpriseId],
        references: [enterprisesTable.id],
    }),
    appointmentsTable: many(appointmentsTable),
}));

export const professionalsToServicesTable = pgTable("professionals_to_services", {
    professionalId: uuid("professional_id")
        .notNull()
        .references(() => professionalsTable.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id")
        .notNull()
        .references(() => servicesTable.id, { onDelete: "cascade" }),
    createdAT: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const professionalsToServicesTableRelations = relations(professionalsToServicesTable, ({ one }) => ({
    professional: one(professionalsTable, {
        fields: [professionalsToServicesTable.professionalId],
        references: [professionalsTable.id],
    }),
    service: one(servicesTable, {
        fields: [professionalsToServicesTable.serviceId],
        references: [servicesTable.id],
    }),
}));

export const servicesTable = pgTable("services", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    servicePriceInCents: integer("service_price_in_cents").notNull(),
    duration: integer("duration").notNull(),
    createdAT: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
    enterpriseId: uuid("enterprise_id")
        .notNull()
        .references(() => enterprisesTable.id, { onDelete: "cascade" }),
    professionalId: uuid("professional_id")
        .notNull()
        .references(() => professionalsTable.id, { onDelete: "cascade" }),
});

export const clientsTable = pgTable("clients", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    phoneNumber: text("phone_number").notNull(),
    createdAT: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
    //Relationships
    enterpriseId: uuid("enterprise_id")
        .notNull()
        .references(() => enterprisesTable.id, { onDelete: "cascade" }),
});

export const clientsTableRelations = relations(clientsTable, ({ one }) => ({
    enterprise: one(enterprisesTable, {
        fields: [clientsTable.enterpriseId],
        references: [enterprisesTable.id],
    }),
}));

export const appointmentsTable = pgTable("appointments", {
    id: uuid("id").defaultRandom().primaryKey(),
    date: timestamp("date").notNull(),
    createdAT: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
    //Relationships
    enterpriseId: uuid("enterprise_id")
        .notNull()
        .references(() => enterprisesTable.id, { onDelete: "cascade" }),
    clientId: uuid("client_id")
        .notNull()
        .references(() => clientsTable.id, { onDelete: "cascade" }),
    professionalId: uuid("professional_id")
        .notNull()
        .references(() => professionalsTable.id, { onDelete: "cascade" }),
});

export const appointmentsTableRelations = relations(appointmentsTable, ({ one }) => ({
    enterprise: one(enterprisesTable, {
        fields: [appointmentsTable.enterpriseId],
        references: [enterprisesTable.id],
    }),
    client: one(clientsTable, {
        fields: [appointmentsTable.clientId],
        references: [clientsTable.id],
    }),
    professional: one(professionalsTable, {
        fields: [appointmentsTable.professionalId],
        references: [professionalsTable.id],
    }),
}));