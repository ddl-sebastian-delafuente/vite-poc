load("//rules:ts_project.bzl", "ts_project")

package(default_visibility = ["//:__subpackages__"])

ts_project(
    name = "stories",
    srcs = glob([
        "**/*.tsx",
        "**/*.ts",
    ]),
    tsconfig = "//frontend:jest_tsconfig",
    deps = [
        "//frontend/packages/domino-api:ts_outputs",
        "//frontend/packages/ui:ts_outputs",
        "//frontend/packages/ui/tests:test_lib",
        "@npm//@ant-design",
        "@npm//@storybook",
        "@npm//@types",
        "@npm//antd",
        "@npm//fetch-mock",
        "@npm//react",
        "@npm//react-router-dom",
        "@npm//styled-components",
        "@npm//chroma-js"
    ],
)
