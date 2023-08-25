load("@build_bazel_rules_nodejs//:index.bzl", "copy_to_bin")
load("//rules:ts_project.bzl", "ts_project")
load("//rules:domino_ui_test.bzl", "domino_ui_test")

package(default_visibility = ["//:__subpackages__"])

ts_project(
    name = "src",
    package_name = "@domino/ui/dist",
    srcs = glob(
        include = [
            "**/*.ts",
            "**/*.tsx",
        ],
        exclude = [
            "**/__tests__/**/*.test.ts",
            "**/__tests__/**/*.test.tsx",
            "**/__stories__/**",
        ],
    ),
    tsconfig = "//frontend/packages/ui:tsconfig",
    deps = [
        "@npm//@ant-design/compatible",
        "@npm//@ant-design/icons",
        "@npm//@types",
        "@npm//styled-components",
        "@npm//antd",
        "@npm//axios",
        "@npm//ts-key-enum",
        "@npm//jest-useragent-mock",
        "@npm//date-fns",
        "@npm//papaparse",
        "@npm//react-ngl",
        "@npm//redux",
        "@npm//redux-saga",
        "@npm//highcharts",
        "@npm//highcharts-react-official",
        "@npm//millify",
        "@npm//prettier",
        "@npm//react-markdown",
        "@npm//storybook-dark-mode",
        "@npm//copy-to-clipboard",
        "@npm//pluralize",
        "@npm//git-url-parse",
        "@npm//noty",
        "//frontend/packages/domino-api:ts_outputs",
        "//frontend/packages/domino-api:ts_outputs_dmm",
        "//frontend/packages/domino-api:ts_outputs_domino_cost",
        "//frontend/packages/domino-api:ts_outputs_training_set",
        # runtime deps
        "@npm//@storybook/react",
        "@npm//axios-mock-adapter",
        "@npm//chroma-js",
        "@npm//cron-parser",
        "@npm//google-code-prettify",
        "@npm//@storybook/addons",
        "@npm//moment",
        "@npm//tsutils",
        "@npm//socket.io-client",
        "@npm//uuid",
        "@npm//email-validator",
        "@npm//is-git-branch-name-valid",
        "@npm//json-to-csv-export",
        "@npm//mixpanel-browser",
        "@npm//moment-timezone",
        "@npm//react-multiline-clamp",
        "@npm//react-query",
        "@npm//rxjs",
        "@npm//virtualizedtableforantd4",
        "@npm//highlight-react"
    ],
)

ts_project(
    name = "stories",
    srcs = glob([
        "**/__stories__/**/*.tsx",
        "**/__stories__/**/*.ts",
    ]),
    tsconfig = "//frontend:jest_tsconfig",
    deps = [
        ":src",
        "//frontend/packages/domino-api:ts_outputs",
        "//frontend/packages/mocks:ts_outputs",
        "//frontend/packages/test-utils:ts_outputs",
        "@npm//@types",
        "@npm//antd",
        "@npm//moment",
        "@npm//storybook-dark-mode",
    ],
)

copy_to_bin(
    name = "css_files",
    srcs = ["navbar/stylePrimaryNav.css"],
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
        "//frontend/packages/ui/tests:test_lib",
        "@npm//@testing-library/user-event",
    ],
    tags = ["cpu:8"],
    test_size = "medium",
    deps = [
        "@npm//jest-styled-components",
        "@npm//react-router",
    ],
)

filegroup(
    name = "uncategorized_files",
    srcs = glob(
        include = ["**"],
        exclude = [
            "**/*.ts",
            "**/*.tsx",
        ],
    ),
    tags = ["uncategorized_files"],
)
