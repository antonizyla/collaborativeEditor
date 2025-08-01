import type { UUID } from './sessions';

const create = `
    CREATE TABLE LOGS IF NOT EXISTS (
        logId UUID NOT NULL PRIMARY KEY,
        subservice TEXT,
        severity INTEGER
    );
`;

export interface Log {
	logId: UUID;
}
