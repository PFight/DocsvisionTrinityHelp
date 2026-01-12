import { BaseControlParams, BaseControlState, BaseControl } from "@docsvision/webclient/System/BaseControl";
import { ControlImpl } from "@docsvision/webclient/System/ControlImpl";
import { IBindingResult } from "@docsvision/webclient/System/IBindingResult";
import { $CardId, $ControlStore } from "@docsvision/webclient/System/LayoutServices";
import { r } from "@docsvision/webclient/System/Readonly";
import { rw } from "@docsvision/webclient/System/Readwrite";
import React from "react";
import { VisitorGiftHtml } from "./VisitorGiftHtml";
import { onVisitorOpen } from "./VisitorGiftLogic/visitor";

/**
 * Содержит публичные свойства элемента управления [VisitorGift]{@link VisitorGift}.
 */
export class VisitorGiftParams extends BaseControlParams {
    /** Стандартный CSS класс со стилями элемента управления. */
    @r standardCssClass?: string = "visitor-gift";

    /** Сервисы, необходимые для работы контрола. */
    @rw services?: $CardId & $ControlStore;
}

export interface IVisitorGiftState extends VisitorGiftParams, BaseControlState {
    binding: IBindingResult<string>;
}

/** Реализация элемента управления VisitorGift */
export class VisitorGift extends BaseControl<VisitorGiftParams, IVisitorGiftState> {
    /** Вызывается до рендеринга, но после вызова хандлеров и инициализации сервисов. */
    protected prepare() {
    }

    /** Вызывается после отображения контрола в DOM браузера */
    init() {
        onVisitorOpen(this.layout);
    }

    /**
     * Вызывается перед удалением контрола из DOM браузера
     */
    deinit() {

    }

    protected createParams() {
        return new VisitorGiftParams();
    }

    protected createImpl() {
        return new ControlImpl(this.props, this.state, this.renderControl.bind(this));
    }


    renderControl() {
        return (
          <div dangerouslySetInnerHTML={{ __html: VisitorGiftHtml }}></div>
        );
    }
}


