
CREATE TABLE model(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) DEFAULT NULL
);

CREATE TYPE MODEL_FIELD_TYPE AS ENUM('STRING', 'NUMBER', 'LIST', 'REFERENCE');

CREATE TABLE model_field(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    model_id uuid not NULL,
    "type" MODEL_FIELD_TYPE NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    config JSON DEFAULT NULL,
    CONSTRAINT fk_model_field_model_id FOREIGN KEY (model_id) REFERENCES model(id) ON DELETE CASCADE
);

CREATE TABLE entity (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    model_id uuid not NULL,
    CONSTRAINT fk_entity_model_id FOREIGN KEY (model_id) REFERENCES model(id) ON DELETE CASCADE
);

CREATE TABLE entity_field (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    entity_id uuid not NULL,
    model_field_id uuid not NULL,
    value JSON default NULL,
    CONSTRAINT fk_entity_entity_id FOREIGN KEY (entity_id) REFERENCES entity(id) ON DELETE CASCADE,
    CONSTRAINT fk_entity_model_field_id FOREIGN KEY (model_field_id) REFERENCES model_field(id) ON DELETE CASCADE
);


CREATE TABLE entity_field_reference (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    entity_id uuid not NULL,
    entity_field_id uuid not NULL,
    CONSTRAINT fk_entity_field_reference_entity_id FOREIGN KEY (entity_id) REFERENCES entity(id) ON DELETE CASCADE,
    CONSTRAINT fk_entity_field_entity_field_id FOREIGN KEY (entity_field_id) REFERENCES entity_field(id) ON DELETE CASCADE
);


CREATE TABLE "user" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);