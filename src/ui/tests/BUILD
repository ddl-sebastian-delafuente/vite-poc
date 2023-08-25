load("@build_bazel_rules_nodejs//:index.bzl", "js_library")
load("//rules:domino_ui_test.bzl", "domino_ui_test")
load("//rules:ts_project.bzl", "ts_project")

package(default_visibility = ["//:__subpackages__"])

ts_project(
    name = "test_lib",
    package_name = "domino/frontend/packages/ui/tests",
    srcs = glob(
        include = [
            "**/*.tsx",
            "**/*.ts",
        ],
        exclude = [
            "**/*.test.tsx",
            "**/*.test.ts",
        ],
    ),
    tsconfig = "//frontend:jest_tsconfig",
    deps = [
        "//frontend/packages/domino-api:ts_outputs",
        "//frontend/packages/domino-api:ts_outputs_dmm",
        "//frontend/packages/test-utils:ts_outputs",
        "//frontend/packages/ui:ts_outputs",
        "@npm//@testing-library/react",
        "@npm//@testing-library/react-hooks",
        "@npm//@types",
        "@npm//jest-runtime",
        "@npm//papaparse",
        "@npm//ramda",
        "@npm//react-ngl",
        "@npm//redux",
        "@npm//redux-saga",
        "@npm//styled-components",
        "@npm//ts-jest",
        "@npm//whatwg-fetch",
    ],
)

js_library(
    name = "browser_mocks",
    srcs = ["util/browserMocks.js"],
)

domino_ui_test(
    name = "all_test",
    srcs = glob(
        include = [
            "**/*.test.tsx",
            "**/*.test.ts",
        ],
    ),
    compile_deps = [
        ":test_lib",
        "//frontend/packages/ui/stories",
        "@npm//@ant-design/compatible",
        "@npm//@testing-library/react",
        "@npm//@testing-library/react-hooks",
        "@npm//@testing-library/user-event",
    ],
    tags = ["cpu:8"],
    test_size = "medium",
    deps = [
        "@npm//jest-styled-components",
        "@npm//react-router",
    ],
)
