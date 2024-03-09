import {ReflectionKind} from "typedoc";
import {JSX} from "../jsx";


export const icons: Record<
    | ReflectionKind
    | "chevronDown"
    | "checkbox"
    | "menu"
    | "search"
    | "chevronSmall"
    | "anchor",
    () => JSX.Element
> = {
    [ReflectionKind.Accessor]: () => <>📥</>,
    [ReflectionKind.CallSignature]:() => <>🖋️</>,
    [ReflectionKind.Class]: () => <>🐕</>,
    [ReflectionKind.Constructor]: () => <>🪝</>,
    [ReflectionKind.ConstructorSignature]:()=><>🍌</>,
    [ReflectionKind.Enum]: () => <>💍</>,
    [ReflectionKind.EnumMember]:()=><>🌄</>,
    [ReflectionKind.Function]: () => <>🎗️</>,
    [ReflectionKind.GetSignature]() {
        return this[ReflectionKind.Accessor]();
    },
    [ReflectionKind.IndexSignature]() {
        return this[ReflectionKind.Property]();
    },
    [ReflectionKind.Interface]: () => <>📒</>,
    [ReflectionKind.Method]: () => <>📦</>,
    [ReflectionKind.Module]:()=> <>📁</>,
    [ReflectionKind.Namespace]: () => <>🗃️</>,
    [ReflectionKind.Parameter]() {
        return this[ReflectionKind.Property]();
    },
    [ReflectionKind.Project]() {
        return this[ReflectionKind.Module]();
    },
    [ReflectionKind.Property]: () => <>🏷️</>,
    [ReflectionKind.Reference]: () => <>🔖</>,
    [ReflectionKind.SetSignature]() {
        return this[ReflectionKind.Accessor]();
    },
    [ReflectionKind.TypeAlias]: () => <>🧷</>,
    [ReflectionKind.TypeLiteral]() {
        return this[ReflectionKind.TypeAlias]();
    },
    [ReflectionKind.TypeParameter]() {
        return this[ReflectionKind.TypeAlias]();
    },
    [ReflectionKind.Variable]: () => <>☀️</>,
    chevronDown: () => (
        <img width={23} height={23}  alt='D' src={`https://www.iconninja.com/files/801/138/456/chevron-down-icon.png`}/>
    ),
    chevronSmall: () => (
        <img width={23} height={23}  alt='S' src={`https://www.iconninja.com/files/801/138/456/chevron-down-icon.png`}/>
    ),
    checkbox: () => (
        <img width={23} height={23} alt='checkbox' src={`https://www.iconninja.com/files/258/202/549/checkbox-icon.png`}/>
    ),
    menu: () => (
        <img width={23} height={23} alt="menu" src={`https://www.iconninja.com/files/197/70/491/blue-menu-icon.png`}/>
    ),
    search: () => (
        <img width={23} height={23} alt="search" src={`https://www.iconninja.com/files/884/470/364/search-icon.png`}/>
    ),
    anchor: () => (
        <img width={23} height={23} alt="anchor" src={`https://www.iconninja.com/files/460/245/160/anchor-icon.png`} />
    ),
};
