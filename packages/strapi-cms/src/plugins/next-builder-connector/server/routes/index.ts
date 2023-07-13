export default [
  {
    method: "GET",
    path: "/token",
    handler: "token.getToken",
    config: {
      policies: [
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["plugin::next-builder-connector.preview"],
          },
        },
      ],
    },
  },
];
