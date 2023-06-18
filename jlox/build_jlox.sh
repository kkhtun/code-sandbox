#!/bin/sh

# Generate AST classes (optional if you have not added or updated AST classes)
java ./com/kevin/tools/GenerateAst.java ./com/kevin/jlox

# Generate java class files
javac -d ./classes ./com/kevin/jlox/Jlox.java

# Use GraalVM native-image to create a static binary of jlox
native-image --static -cp ./classes -o jlox com.kevin.jlox.Jlox
