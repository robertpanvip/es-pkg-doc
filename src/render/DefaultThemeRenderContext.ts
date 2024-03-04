import {index} from "./partials";
import {icons} from "./partials/icon";
import {header} from "./partials/header";
import {commentSummary, commentTags, reflectionFlags,} from "./partials/comment";
import {breadcrumb} from "./partials/breadcrumb";
import {reflectionTemplate} from "./templates/reflection";
import {memberDeclaration} from "./partials/member.declaration";
import {parameter} from "./partials/parameter";
import {type} from "./partials/type";
import {memberSignatureTitle} from "./partials/member.signature.title";
import {memberSignatureBody} from "./partials/member.signature.body";
import {memberReference} from "./partials/member.reference";
import {member} from "./partials/member";
import {memberGetterSetter} from "./partials/member.getterSetter";
import {memberSignatures} from "./partials/member.signatures";
import {memberSources} from "./partials/member.sources";
import {members} from "./partials/members";
import {membersGroup} from "./partials/members.group";
import {typeAndParent} from "./partials/typeAndParent";
import {typeParameters} from "./partials/typeParameters";
import {hierarchy} from "./partials/hierarchy";
import {analytics} from "./partials/analytics";
import {reflectionPreview} from "./partials/reflectionPreview";
import {footer} from "./partials/footer";
import {script} from "./partials/script";
import {defaultLayout} from "./layouts/default";
import {navigation, pageNavigation, pageSidebar, settings, sidebar, sidebarLinks,} from "./partials/navigation";
import {toolbar} from "./partials/toolbar";
import {indexTemplate} from "./templates";
import {hierarchyTemplate} from "./templates/hierarchy";
import {tableTemplate} from "./templates/table.tsx";

import type {
    Options,
    RendererHooks,
    PageEvent,
    ProjectReflection,
    NavigationElement,
} from 'typedoc'
import {
    CommentDisplayPart,
    DeclarationReflection,
    Reflection,
    ReflectionCategory,
    ReflectionGroup,
    ReflectionKind
} from "typedoc";
import * as Path from "path";
import {ConsoleLogger} from "./utils/loggers.ts";
import {classNames, getDisplayName, toStyleClass} from "./utils/lib.tsx";
import {NeverIfInternal} from "./utils/general.ts";

function bind<F, L extends any[], R>(fn: (f: F, ...a: L) => R, first: F) {
    return (...r: L) => fn(first, ...r);
}

const urlPrefix = /^(http|ftp)s?:\/\//;

function getRelativeUrl(absolute: string, location: string): string {
    if (urlPrefix.test(absolute)) {
        return absolute;
    } else {
        return Path.posix.relative(location, absolute) || ".";
    }
}

function getReflectionClasses(reflection: DeclarationReflection, filters: Record<string, boolean>) {
    const classes: string[] = [];

    // Filter classes should match up with the settings function in
    // partials/navigation.tsx.
    for (const key of Object.keys(filters)) {
        if (key === "inherited") {
            if (reflection.inheritedFrom) {
                classes.push("tsd-is-inherited");
            }
        } else if (key === "protected") {
            if (reflection.flags.isProtected) {
                classes.push("tsd-is-protected");
            }
        } else if (key === "private") {
            if (reflection.flags.isPrivate) {
                classes.push("tsd-is-private");
            }
        } else if (key === "external") {
            if (reflection.flags.isExternal) {
                classes.push("tsd-is-external");
            }
        } else if (key.startsWith("@")) {
            if (key === "@deprecated") {
                if (reflection.isDeprecated()) {
                    classes.push(toStyleClass(`tsd-is-${key.substring(1)}`));
                }
            } else if (
                reflection.comment?.hasModifier(key as `@${string}`) ||
                reflection.comment?.getTag(key as `@${string}`)
            ) {
                classes.push(toStyleClass(`tsd-is-${key.substring(1)}`));
            }
        }
    }

    return classes.join(" ");
}

function shouldShowCategories(reflection: Reflection, opts: { includeCategories: boolean; includeGroups: boolean }) {
    if (opts.includeCategories) {
        return !reflection.comment?.hasModifier("@hideCategories");
    }
    return reflection.comment?.hasModifier("@showCategories") === true;
}

function shouldShowGroups(reflection: Reflection, opts: { includeCategories: boolean; includeGroups: boolean }) {
    if (opts.includeGroups) {
        return !reflection.comment?.hasModifier("@hideGroups");
    }
    return reflection.comment?.hasModifier("@showGroups") === true;
}

export class DefaultThemeRenderContext {
    url: string
    options: Options;
    public page: PageEvent<Reflection>
    logger: ConsoleLogger = new ConsoleLogger()

    constructor({url = "", options, page}: { url: string, options: Options, page: PageEvent<Reflection> }) {
        this.url = url;
        this.options = options;
        this.page = page
    }

    get icons(): Readonly<typeof icons> {
        return icons;
    }

    iconsCache() {
        return icons;
    }

    buildNavigation(project: ProjectReflection): NavigationElement[] {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const theme = this;
        const opts = this.options.getValue("navigation");
        const leaves = this.options.getValue("navigationLeaves");

        if (opts.fullTree) {
            this.logger.warn(
                `The navigation.fullTree option no longer has any affect and will be removed in v0.26`,
            );
        }

        return getNavigationElements(project) || [];

        function toNavigation(
            element: ReflectionCategory | ReflectionGroup | DeclarationReflection,
        ): NavigationElement {
            if (element instanceof ReflectionCategory || element instanceof ReflectionGroup) {
                return {
                    text: element.title,
                    children: getNavigationElements(element),
                };
            }

            return {
                text: getDisplayName(element),
                path: element.url,
                kind: element.kind,
                class: classNames({deprecated: element.isDeprecated()}, theme.getReflectionClasses(element)),
                children: getNavigationElements(element),
            };
        }

        function getNavigationElements(
            parent: ReflectionCategory | ReflectionGroup | DeclarationReflection | ProjectReflection,
        ): undefined | NavigationElement[] {
            if (parent instanceof ReflectionCategory) {
                return parent.children.map(toNavigation);
            }

            if (parent instanceof ReflectionGroup) {
                if (shouldShowCategories(parent.owningReflection, opts) && parent.categories) {
                    return parent.categories.map(toNavigation);
                }
                return parent.children.map(toNavigation);
            }

            if (leaves.includes(parent.getFullName())) {
                return;
            }

            if (!parent.kindOf(ReflectionKind.SomeModule | ReflectionKind.Project)) {
                return;
            }

            if (parent.categories && shouldShowCategories(parent, opts)) {
                return parent.categories.map(toNavigation);
            }

            if (parent.groups && shouldShowGroups(parent, opts)) {
                return parent.groups.map(toNavigation);
            }

            if (
                opts.includeFolders &&
                parent.children?.every((child) => child.kindOf(ReflectionKind.Module)) &&
                parent.children.some((child) => child.name.includes("/"))
            ) {
                return deriveModuleFolders(parent.children);
            }

            return parent.children?.map(toNavigation);
        }

        function deriveModuleFolders(children: DeclarationReflection[]) {
            const result: NavigationElement[] = [];

            const resolveOrCreateParents = (
                path: string[],
                root: NavigationElement[] = result,
            ): NavigationElement[] => {
                if (path.length > 1) {
                    const inner = root.find((el) => el.text === path[0]);
                    if (inner) {
                        inner.children ||= [];
                        return resolveOrCreateParents(path.slice(1), inner.children);
                    } else {
                        root.push({
                            text: path[0],
                            children: [],
                        });
                        return resolveOrCreateParents(path.slice(1), root[root.length - 1].children);
                    }
                }

                return root;
            };

            // Note: This might end up putting a module within another module if we document
            // both foo/index.ts and foo/bar.ts.
            for (const child of children) {
                const parts = child.name.split("/");
                const collection = resolveOrCreateParents(parts);
                const nav = toNavigation(child);
                nav.text = parts[parts.length - 1];
                collection.push(nav);
            }

            // Now merge single-possible-paths together so we don't have folders in our navigation
            // which contain only another single folder.
            const queue = [...result];
            while (queue.length) {
                const review = queue.shift()!;
                queue.push(...(review.children || []));
                if (review.kind || review.path) continue;

                if (review.children?.length === 1) {
                    const copyFrom = review.children[0];
                    const fullName = `${review.text}/${copyFrom.text}`;
                    delete review.children;
                    Object.assign(review, copyFrom);
                    review.text = fullName;
                    queue.push(review);
                }
            }

            return result;
        }
    }


    getNavigation = () =>this.buildNavigation(this.page.project);
    hook = (name: keyof RendererHooks) => {
        console.log(name)
        return ""
    }
    markdown = (
        md: readonly CommentDisplayPart[] | NeverIfInternal<string | undefined>
    ) => {
        if (md instanceof Array) {
            return md.map(item => item.text).join('')
        }
        return md as string;
    };
    relativeURL = (url: string, cacheBust = false) => {
        const location = Path.posix.dirname(this.url)
        const result = getRelativeUrl(url, location);
        if (cacheBust) {
            return result + `?cache`;
        }
        return result
    };

    urlTo = (reflection: Reflection) => {
        return reflection.url ? this.relativeURL(reflection.url) : "";
    };
    getReflectionClasses = (df: DeclarationReflection) =>
        getReflectionClasses(df, {});

    reflectionTemplate = bind(reflectionTemplate, this);
    tableTemplate = bind(tableTemplate, this);
    indexTemplate = bind(indexTemplate, this);
    hierarchyTemplate = bind(hierarchyTemplate, this);
    defaultLayout = bind(defaultLayout, this);

    /**
     * Rendered just after the description for a reflection.
     * This can be used to render a shortened type display of a reflection that the
     * rest of the page expands on.
     *
     * Note: Will not be called for variables/type aliases, as they are summarized
     * by their type declaration, which is already rendered by {@link DefaultThemeRenderContext.memberDeclaration}
     */
    reflectionPreview = bind(reflectionPreview, this);
    script = bind(script, this);
    analytics = bind(analytics, this);
    breadcrumb = bind(breadcrumb, this);
    commentSummary = bind(commentSummary, this);
    commentTags = bind(commentTags, this);
    reflectionFlags = bind(reflectionFlags, this);
    footer = bind(footer, this);
    header = bind(header, this);
    hierarchy = bind(hierarchy, this);
    index = bind(index, this);
    member = bind(member, this);
    memberDeclaration = bind(memberDeclaration, this);
    memberGetterSetter = bind(memberGetterSetter, this);
    memberReference = bind(memberReference, this);
    memberSignatureBody = bind(memberSignatureBody, this);
    memberSignatureTitle = bind(memberSignatureTitle, this);
    memberSignatures = bind(memberSignatures, this);
    memberSources = bind(memberSources, this);
    members = bind(members, this);
    membersGroup = bind(membersGroup, this);
    sidebar = bind(sidebar, this);
    pageSidebar = bind(pageSidebar, this);
    sidebarLinks = bind(sidebarLinks, this);
    settings = bind(settings, this);
    navigation = bind(navigation, this);
    pageNavigation = bind(pageNavigation, this);
    parameter = bind(parameter, this);
    toolbar = bind(toolbar, this);
    type = bind(type, this);
    typeAndParent = bind(typeAndParent, this);
    typeParameters = bind(typeParameters, this);

}
