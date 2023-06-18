package com.kevin.jlox;

class AstPrinter implements Expr.Visitor<String> {
    String print(Expr expr) {
        return expr.accept(this);
    }

    @Override
    public String visitBinaryExpr(Expr.Binary expr) {
        return parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    @Override
    public String visitGroupingExpr(Expr.Grouping expr) {
        return parenthesize("group", expr.expression);
    }

    @Override
    public String visitLiteralExpr(Expr.Literal expr) {
        if (expr.value == null)
            return "nil";
        return expr.value.toString();
    }

    @Override
    public String visitUnaryExpr(Expr.Unary expr) {
        return parenthesize(expr.operator.lexeme, expr.right);
    }

    // I don't wanna delete this but I'll just put these methods here so java
    // interface won't
    // complain
    @Override
    public String visitVariableExpr(Expr.Variable expr) {
        return expr.name.lexeme;
    }

    @Override
    public String visitAssignExpr(Expr.Assign expr) {
        return parenthesize(expr.name.lexeme + " =", expr.value);
    }

    @Override
    public String visitLogicalExpr(Expr.Logical expr) {
        return parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    @Override
    public String visitCallExpr(Expr.Call expr) {
        return parenthesize(expr.callee.toString(), expr);
    }

    @Override
    public String visitGetExpr(Expr.Get expr) {
        return parenthesize("Get: " + expr.name.lexeme, expr.object);
    }

    @Override
    public String visitSetExpr(Expr.Set expr) {
        return parenthesize("Get: " + expr.name.lexeme, expr.object, expr.value);
    }

    @Override
    public String visitThisExpr(Expr.This expr) {
        return "( This )";
    }

    @Override
    public String visitSuperExpr(Expr.Super expr) {
        return "( " + expr.keyword.lexeme + " " + expr.method.lexeme + " )";
    }

    private String parenthesize(String name, Expr... exprs) {
        StringBuilder builder = new StringBuilder();

        builder.append("(").append(name);
        for (Expr expr : exprs) {
            builder.append(" ");
            builder.append(expr.accept(this));
        }
        builder.append(")");

        return builder.toString();
    }
}
