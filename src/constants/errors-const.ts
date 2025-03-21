export const ErrorKey = {
    ROUTE_ID: 'id',
    BODY_ID: '$.id',
    BOOK_ID: '$.idBook',
    TITLE: '$.title',
    DESCRIPTION: '$.description',
    PAGE_COUNT: '$.pageCount',
    EXCERPT: '$.excerpt',
    PUBLISH_DATE: '$.publishDate',
    FIRST_NAME: '$.firstName',
    LAST_NAME: '$.lastName'
} as const;

export const ErrorMessage = {
    CAN_NOT_CONVERT_TO_INT: /The JSON value could not be converted to System\.Int32\. .*/,
    CAN_NOT_CONVERT_TO_DATE: /The JSON value could not be converted to System\.DateTime\. .*/,
    CAN_NOT_CONVERT_TO_STRING: /The JSON value could not be converted to System\.String\. .*/,
    VALUE_NOT_VALID: /The value '.*' is not valid/
} as const;