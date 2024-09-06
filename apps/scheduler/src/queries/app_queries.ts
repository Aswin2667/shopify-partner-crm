
export const GET_UNSYNCED_APPS = `
  SELECT 
    i."id" AS "integrationId",
    i."organizationId" AS "organizationId",
    i.data->>'partnerId' AS "partnerId",
    i.data->>'accessToken' AS "accessToken",
    p.data->>'appId' AS "appId",
    p."name" AS "name",
    p."id" AS "projectId"
  FROM 
    "Integration" i
  JOIN 
    "Project" p 
  ON 
    i."id" = p."integrationId"
  WHERE 
    p."isSynced" = false
`;

export const GET_APPS_AFTER_LAST_OCCURRED_AT = `
  SELECT 
    i."id" AS "integrationId",
    i."organizationId" AS "organizationId",
    i.data->>'partnerId' AS "partnerId",
    i.data->>'accessToken' AS "accessToken",
    p.data->>'appId' AS "appId",
    p."name" AS "name",
    p."id" AS "projectId"
  FROM 
    "Integration" i
  JOIN 
    "Project" p 
  ON 
    i."id" = p."integrationId"
`;
