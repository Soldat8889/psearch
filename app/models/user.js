export default (sequelize, DataTypes) => {
    // eslint-disable-next-line no-unused-vars
    const models = { sequelize };

    let user = sequelize.define("user", {
        Id_User: {
            autoIncrement: true,
            primaryKey   : true,
            type         : DataTypes.INTEGER
        },
        Username_User: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [6, 45]
            }
        },
        Email_User: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                len: [3, 254]
            }
        },
        Password_User: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Avatar_User: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /.*\.(?:jpe?g|png|gif)/gi
            },
            defaultValue: "/avatars/default--avatar.png"
        },
        Grade_User: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [["Client", "Premium", "Moderator", "Administrator"]]
            },
            defaultValue: "Client"
        }
    });

    return user;
};
