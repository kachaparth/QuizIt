package com.example.quizit.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "QuestionAnalyticsUser")
public class QuestionAnalyticsUser {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "qau_id")
    private UUID qauId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "time_spent")
    private Integer timeSpent;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "selected_answer", columnDefinition = "jsonb")
    private Object selectedAnswer;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "tab_switch_count")
    private Integer tabSwitchCount = 0;
}
